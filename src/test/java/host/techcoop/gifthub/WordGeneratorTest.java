package host.techcoop.gifthub;

import static com.google.common.truth.Truth.*;
import static org.mockito.Mockito.*;

import com.google.common.collect.ImmutableList;
import java.util.List;
import java.util.Random;
import java.util.stream.IntStream;
import org.junit.Before;
import org.junit.Test;

public class WordGeneratorTest {
  ImmutableList<String> words = ImmutableList.of("test", "word", "a", "monkey");
  Random random;
  WordGenerator generator;

  @Before
  public void setUp() {
    random = mock(Random.class);
    generator = new WordGenerator(words, random);
  }

  @Test
  public void generatingOneWordExcludesJoiningChar() {
    assertThat(generator.getWords(1, " ")).doesNotContain(" ");
  }

  @Test
  public void shortWordsFiltered() {
    List<String> expectedResult = ImmutableList.of("test", "word", "monkey");
    for (int i = 0; i < 3; i++) {
      when(random.ints(1, 0, 3)).thenReturn(IntStream.of(i));
      assertThat(generator.getWords(1, "")).isEqualTo(expectedResult.get(i));
    }
  }
}
